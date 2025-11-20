import { defineConfig } from 'vitest/config'

/**
 * --------------------------------------------------------
 * Vitest Configuration
 * --------------------------------------------------------
 * This file configures how your unit and integration tests
 * run in your project.
 */
export default defineConfig({
  test: {
    /**
     * Use globals like `describe`, `it`, `expect` directly
     * without importing them in every test file.
     */
    globals: true,

    /**
     * Global setup script
     * -------------------
     * Runs before any test is executed.
     * Useful for things like:
     *  - Database connection
     *  - Seeding test data
     *  - Mocking external services
     */
    globalSetup: ['./tests/setup/globalSetup.ts'],

    /**
     * Automatically clean up mocks after each test.
     * Ensures tests are isolated and do not leak state.
     */
    clearMocks: true,

    /**
     * Restores mocked functions back to their original implementation
     * after each test. This prevents interference between tests.
     */
    restoreMocks: true,

    /**
     * Test pool settings
     * -------------------
     * Ensures tests run sequentially when needed (single-threaded)
     * to avoid conflicts, especially with shared resources like a database.
     */
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Run tests sequentially instead of in parallel
      },
    },
  },

  /**
   * Plugins array
   * -------------
   * Can be used to add Vitest plugins if needed.
   * Currently empty.
   */
  plugins: [],
})
