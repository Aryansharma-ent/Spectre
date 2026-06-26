export interface Project {
  _id: string;
  name: string;
  stagingUrl: string;
  productionUrl: string;
  createdAt: string;
  apikey?: string;
}

export interface TestRun {
  _id: string;
  projectId: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
  mismatchPercentage: number;
  totalPixelsCompared: number;
  mismatchPixelsCount: number;
  stagingScreenshotUrl: string;
  productionScreenshotUrl: string;
  diffScreenshotUrl: string;
  visualBugs: Array<{
    element: string;
    description: string;
    location: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    aiSuggestion?: {
      explanation: string;
      cssFix: string;
    };
  }>;
  createdAt: string;
}
