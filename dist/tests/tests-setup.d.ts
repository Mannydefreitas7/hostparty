/**
 * shared resources used by the nested integration tests
 */
export interface TestConfig {
    orig: string;
    path: string;
}
declare const config: TestConfig;
export declare const setupTestFile: () => void;
export declare const cleanupTestFile: () => Promise<void>;
export default config;
//# sourceMappingURL=tests-setup.d.ts.map