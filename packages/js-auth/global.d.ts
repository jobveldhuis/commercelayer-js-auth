declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VITE_TEST_SALES_CHANNEL_CLIENT_ID: string
    VITE_TEST_SALES_CHANNEL_CLIENT_SECRET: string
    VITE_TEST_INTEGRATION_CLIENT_ID: string
    VITE_TEST_INTEGRATION_CLIENT_SECRET: string
    VITE_TEST_USER_ID: string
    VITE_TEST_CUSTOMER_ID: string
    VITE_TEST_DOMAIN: string
    VITE_TEST_SCOPE: string
    VITE_TEST_USERNAME: string
    VITE_TEST_PASSWORD: string
    VITE_TEST_PROVISIONING_DOMAIN: string
    VITE_TEST_PROVISIONING_CLIENT_ID: string
    VITE_TEST_PROVISIONING_CLIENT_SECRET: string
  }
}
