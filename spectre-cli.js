#!/usr/bin/env node                     // this here is used to tell people using different Os's to download node
const { rejects } = require('assert')
const http = require('http')

//why using http? because if we used express or axios the server will not be fast because of axios installation so we are using manual methods

// helper to parse CLI arguments manually (avoiding third-party packages)


// process.argv looks like this:
// ['node', 'spectre-cli.js', '--project', '123', '--key', 'abc']

function parseArgs() {
    const args = process.argv.slice(2)

    const params = {}

    for (let i = 0; i < args.length; i++) {
       if(args[i].startsWith('--')){
        const key = args[i].slice(2)
        const val = args[i + 1]
        if(val && !val.startsWith('--')){
            params[key] = val;
            i++;
        } else{
            params[key] = true
        }
       }
        
    }

    return params
}

const params = parseArgs()
const projectId = params.project || params.projectId
const apiKey = params.key || params.apiKey
const stagingUrl = params.stagingUrl
const productionUrl = params.productionUrl


if (!projectId || !apiKey) {
    console.error("\x1b[31m❌ Error: Missing required arguments.\x1b[0m");
    console.log("\nUsage:");
    console.log("  node spectre-cli.js --project <projectId> --key <apiKey> [--stagingUrl <url>] [--productionUrl <url>]\n");
    console.log("Options:");
    console.log("  --project, --projectId   The ID of your project target");
    console.log("  --key, --apiKey          The secure API key generated for the project");
    console.log("  --stagingUrl             (Optional) Override staging URL for dynamic PR branch tests");
    console.log("  --productionUrl          (Optional) Override production benchmark URL");
    process.exit(1);
}

//POST request using Node's built-in http module

function postJson(url,headers,body){
    return new Promise((resolve,reject)=>{
        const u = new URL(url)
        const options = {
            hostname : u.hostname,
            port : u.port || 80,
            path : u.pathname,
            method : 'POST',
            headers : {
                 'Content-Type' : 'application/json',
                 ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = ''
            res.on('data',chunk => data += chunk)
            res.on('end', ()=>{
                try {
                    const parsed = JSON.parse(data);
                    if(res.statusCode >= 400){
                        reject(new Error(parsed.message || `HTTP ${res.statusCode}`))
                    }else{
                        resolve(parsed)
                    }
                } catch (e) {
                    reject(new Error(`failed to parse response ${data} `))
                }
            });
        });
        req.on('error',reject);
        req.write(JSON.stringify(body))
        req.end();
    })
}


async function run() {
    const baseUrl = 'http://localhost:8000';
    console.log(`\n\x1b[36m Spectre AI: Triggering visual regression test...\x1b[0m`);
    console.log(`   Project ID: ${projectId}`);

     
    let runId;
    try {
        // Build the payload

        const payload = { projectId };

        if (stagingUrl) payload.stagingUrl = stagingUrl;

        if (productionUrl) payload.productionUrl = productionUrl;

        // Trigger the background Puppeteer scan
        const triggerRes = await postJson(`${baseUrl}/api/tests/test-capture`, {
            'x-api-key': apiKey
        }, payload);
        if (!triggerRes.success || !triggerRes.data) {
            throw new Error(triggerRes.message || "Failed to trigger scan");
        }
        const runData = triggerRes.data;
        runId = runData._id;
        console.log(`\n\x1b[33m Scan Dispatched Run ID: ${runId}\x1b[0m`);
        console.log(`   Staging:    ${runData.stagingUrl}`);
        console.log(`   Production: ${runData.productionUrl}`);
        console.log(`\nPolling for results...`);
    } catch (err) {
        console.error(`\x1b[31m❌ Trigger failed: ${err.message}\x1b[0m\n`);
        process.exit(1);
    }

    //  poll the test run status until it completes
    const pollInterval = 3000; // 3 seconds
    let dots = '';

    const interval = setInterval(async () => {
        try {
            dots = dots.length >= 3 ? '' : dots + '.';

            process.stdout.write(`\rAnalyzing layout differences${dots.padEnd(3)} `);

            const statusRes = await getJson(`${baseUrl}/api/tests/run/${runId}`);

            if (!statusRes.success || !statusRes.data) {
                throw new Error("Failed to fetch run status");
            }
            const run = statusRes.data;
            if (run.status === 'RUNNING') {
                return; // keep waiting
            }
            // test finished stop the interval loop
            clearInterval(interval);

            process.stdout.write('\r\x1b[K'); // clear line

            if (run.status === 'PASSED') {
                console.log(`\n\x1b[32m✔ Visual Regression Test PASSED!\x1b[0m`);

                console.log(`   Mismatch Percentage: ${run.mismatchPercentage.toFixed(2)}%`);

                console.log(`   No layout drifts detected.`);
                process.exit(0); // Exit with success code (0)
            } else if (run.status === 'FAILED') {
                console.error(`\n\x1b[31m❌ Visual Regression Test FAILED\x1b[0m`);

                console.error(`   Mismatch: ${run.mismatchPercentage.toFixed(2)}% (${run.mismatchPixelsCount} pixels mismatched)`);
                console.error(`   Detected Bugs: ${run.visualBugs?.length || 0}`);
                
                if (run.visualBugs && run.visualBugs.length > 0) {
                    console.log(`\nIdentified layout drift issues:`);
                    run.visualBugs.forEach((bug, idx) => {
                        console.log(`   ${idx + 1}. Selector: "${bug.element}" -> ${bug.description}`);
                    });
                }
                console.log(`\n View report: http://localhost:5173/debugger/${runId}?projectId=${projectId}\n`);
                process.exit(1); // Exit with failure code (1) to fail CI/CD builds
            }
        } catch (err) {
            clearInterval(interval);
            console.error(`\n\x1b[31m❌ Polling error: ${err.message}\x1b[0m\n`);
            process.exit(1);
        }
    }, pollInterval);
}

run();
