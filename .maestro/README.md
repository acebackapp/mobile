# Maestro E2E Tests

End-to-end tests for the Discr mobile app using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. Install Maestro CLI:
   ```bash
   # macOS
   brew install maestro

   # Other platforms
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. Have a running iOS Simulator or Android Emulator

3. Have a development build of the app installed:
   ```bash
   # Build and install development build
   eas build --profile development --platform ios
   # or
   npx expo run:ios
   ```

## Environment Variables

Create a `.env.e2e` file (not committed to git):

```bash
E2E_TEST_EMAIL=your-test-account@example.com
E2E_TEST_PASSWORD=your-test-password
```

## Running Tests

### Run all tests:
```bash
npm run e2e
```

### Run a specific flow:
```bash
npm run e2e:flow -- .maestro/flows/my-orders/mark-delivered.yaml
```

### Run tests in a specific folder:
```bash
maestro test .maestro/flows/my-orders/
```

### Run with environment variables:
```bash
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=secret maestro test .maestro/
```

## Test Structure

```
.maestro/
├── config.yaml                    # Maestro configuration
├── flows/
│   ├── auth/
│   │   └── sign-in.yaml          # Authentication flow (init flow)
│   ├── helpers/
│   │   └── do-sign-in.yaml       # Reusable sign-in helper
│   ├── order-stickers/
│   │   ├── package-selection.yaml # Package selection UI test
│   │   └── address-validation.yaml # Address form validation test
│   └── my-orders/
│       ├── view-orders.yaml       # Orders list test
│       ├── order-detail.yaml      # Order detail screen test
│       ├── complete-payment.yaml  # Resume payment flow test
│       ├── cancel-order.yaml      # Cancel order flow test
│       └── mark-delivered.yaml    # Mark as delivered flow test
```

## Writing Tests

Maestro uses YAML for test definitions. Key commands:

```yaml
# Tap on element
- tapOn: "Button Text"
- tapOn:
    id: "element-id"

# Input text
- inputText: "Hello World"

# Assertions
- assertVisible: "Expected Text"
- assertNotVisible: "Should Not See"

# Wait for animations
- waitForAnimationToEnd

# Conditional flows
- runFlow:
    when:
      visible: "Some Element"
    commands:
      - tapOn: "Click Me"

# Scroll
- scrollUntilVisible:
    element: "Target Element"
    direction: DOWN
```

See [Maestro documentation](https://maestro.mobile.dev/api-reference/commands) for full API.

## CI Integration

Tests run automatically on PR merge via GitHub Actions. See `.github/workflows/e2e.yml`.

For local CI simulation:
```bash
npm run e2e:ci
```

## Debugging

### Record test execution:
```bash
maestro record .maestro/flows/my-orders/mark-delivered.yaml
```

### Run in studio (interactive mode):
```bash
maestro studio
```

### View element hierarchy:
```bash
maestro hierarchy
```
