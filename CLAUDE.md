# Discr Mobile - Project Memory

This file contains persistent context for Claude Code sessions on this project.
It will be automatically loaded at the start of every session.

## Project Overview

This is the React Native mobile application for Discr, built with Expo and
powered by Supabase for backend services.

**Key Details:**

- **Framework:** React Native with Expo SDK 52
- **Language:** TypeScript
- **Backend:** Supabase (authentication, database, storage)
- **State Management:** React Context API for auth state
- **Navigation:** Expo Router (file-based routing)
- **Auth:** Supabase Auth with email/password and Google OAuth
- **CI/CD:** GitHub Actions with release workflow
- **Linting:** Pre-commit hooks for code quality

## Repository Structure

```text
mobile/
├── .expo/              # Expo build artifacts
├── .github/workflows/  # CI/CD workflows
├── app/                # Expo Router app directory (file-based routing)
│   ├── (auth)/         # Authentication screens (sign-in, sign-up)
│   ├── (tabs)/         # Main app tab navigation
│   ├── _layout.tsx     # Root layout with AuthProvider
│   └── modal.tsx       # Example modal screen
├── assets/             # Images, fonts, and static assets
├── components/         # Reusable React components
├── constants/          # App constants and theme
├── contexts/           # React contexts (AuthContext)
├── lib/                # Libraries and utilities (Supabase client)
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed via npx)
- iOS Simulator (Mac) or Android Studio

### Environment Variables

Copy `.env.example` to `.env` and fill in Supabase credentials:

- `EXPO_PUBLIC_SUPABASE_URL` - From Supabase dashboard
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard

**Note:** Expo requires the `EXPO_PUBLIC_` prefix for environment variables that
need to be accessible in client-side code.

### Running the App

```bash
npm install          # Install dependencies
npm start            # Start Expo dev server
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run web          # Run in web browser
```

## Git Workflow

**CRITICAL:** All changes MUST go through Pull Requests. Never commit directly
to main.

1. **Create feature branch:** `git checkout -b feature/description`
1. **Make changes** to code or documentation
1. **Write markdown correctly the FIRST time** - Use markdownlint style:
   - Keep lines under 80 characters (break long lines manually)
   - Use `1.` for all ordered list items (auto-numbered)
   - Add blank lines around fenced code blocks
   - Do NOT rely on pre-commit hooks to fix formatting
1. **ALWAYS run pre-commit BEFORE committing:** `pre-commit run --all-files`
   - Fix ALL errors before committing
   - Do NOT commit with `--no-verify` unless absolutely necessary
1. **Commit with conventional format:** `git commit -m "type: description"`
1. **Push and create PR:** `gh pr create --title "feat: description"`
1. **Get PR reviewed and merged** - Never push directly to main

**Commit Format:** Conventional Commits (enforced by pre-commit hook)

- `feat:` - New feature (triggers minor version bump)
- `fix:` - Bug fix (triggers patch version bump)
- `docs:` - Documentation changes (no version bump)
- `chore:` - Maintenance (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `style:` - Code style changes (no version bump)

## Pre-commit Hooks

**Installed hooks:**

- YAML linting (yamllint)
- Markdown linting (markdownlint)
- Conventional commit format
- File hygiene (trailing whitespace, EOF, etc.)

**Setup:**

```bash
pre-commit install              # One-time setup
pre-commit run --all-files      # Run manually
pre-commit autoupdate           # Update hook versions
```

## Important Notes

### Test-Driven Development (TDD) - MANDATORY

**CRITICAL:** All new code MUST be developed using Test-Driven Development.
This is NON-NEGOTIABLE. Writing implementation before tests is FORBIDDEN.

#### The TDD Workflow (MUST FOLLOW)

1. **STOP** - Before writing ANY implementation code, ask yourself: "Do I have a
   failing test for this?" If no, write the test first.

2. **RED Phase** - Write a failing test:
   - Create the test file FIRST if it doesn't exist
   - Write a test that describes the expected behavior
   - Run the test and VERIFY it fails (this proves the test is valid)
   - If the test passes without implementation, the test is wrong

3. **GREEN Phase** - Write minimal implementation:
   - Write ONLY enough code to make the failing test pass
   - Do not add extra functionality "while you're there"
   - Run the test and verify it passes

4. **REFACTOR Phase** - Clean up while tests stay green:
   - Improve code structure without changing behavior
   - Run tests after each change to ensure they still pass

5. **REPEAT** - Go back to step 2 for the next piece of functionality

#### Coverage Requirements - 100% BY DESIGN

TDD naturally produces 100% coverage because:

- Every line of code exists to make a test pass
- No code is written without a corresponding test
- If coverage is below 100%, you skipped TDD

**If you find yourself with <100% coverage, you violated TDD. Fix it immediately.**

#### Verification Checklist (RUN BEFORE EVERY COMMIT)

```bash
# 1. Run tests with coverage
npm test -- --coverage --watchAll=false

# 2. Check coverage report - MUST be 100% for new code
# Coverage summary will be printed to console

# 3. If any new code is uncovered, write tests FIRST then re-run
```

#### Common TDD Violations (DO NOT DO THESE)

❌ "I'll write the component first, then add tests" - WRONG
❌ "Tests are passing, I'll add coverage later" - WRONG
❌ "This is simple, it doesn't need tests" - WRONG
❌ "I'll write all the code, then write all the tests" - WRONG

✅ Write ONE failing test → Write code to pass it → Repeat

#### Test File Locations

- Component tests: `__tests__/<component>.test.tsx`
- Hook tests: `__tests__/hooks/<hook>.test.tsx`
- Integration tests: `__tests__/integration/`
- Screen tests: `__tests__/screens/`

#### Example TDD Session

```bash
# Step 1: Create test file FIRST
touch __tests__/hooks/useMyHook.test.tsx

# Step 2: Write failing test
# ... write test that imports hook that doesn't exist yet ...

# Step 3: Run test - it MUST fail
npm test -- useMyHook --watchAll=false
# Expected: FAIL (module not found or assertion fails)

# Step 4: Write minimal implementation to pass
# ... write just enough code ...

# Step 5: Run test again - it MUST pass now
npm test -- useMyHook --watchAll=false
# Expected: PASS

# Step 6: Repeat for next test case
```

**DO NOT write implementation code without tests. This is non-negotiable.**

### Code Quality Standards

**CRITICAL:** All code must adhere to linter rules from the start.

### React Native Best Practices

- Use TypeScript for all new code
- Follow React hooks best practices
- Optimize images and assets for mobile
- Test on both iOS and Android platforms
- Handle offline scenarios gracefully

### Themed Components - IMPORTANT

**ALWAYS prefer `View` from `react-native` over the themed `View`.**

The project has themed components in `@/components/Themed` that apply automatic
background colors based on the color scheme. This causes unwanted white/dark
backgrounds in nested views.

```typescript
// BAD - causes white background issues
import { View, Text } from '@/components/Themed';

// GOOD - use RN View directly, only use Themed Text when needed
import { View as RNView } from 'react-native';
import { Text } from '@/components/Themed';

// Or import both and alias
import { View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
// Then use RNView for containers, View only when you need themed background
```

**Rule of thumb:**

- Use `RNView` (from react-native) for layout containers
- Use themed `Text` for text that should respect dark/light mode
- Only use themed `View` when you explicitly want a themed background

### Dark Mode Support - MANDATORY

**CRITICAL:** All new screens and components MUST support both light and dark
modes from the start. Never hardcode colors that don't adapt to the theme.

**Required Pattern:**

```typescript
import { useColorScheme, StyleSheet } from 'react-native';

export default function MyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Create dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? '#000' : '#fff',
    },
    text: {
      color: isDark ? '#ccc' : '#333',
    },
    card: {
      backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8',
      borderColor: isDark ? '#333' : '#eee',
    },
    input: {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderColor: isDark ? '#333' : '#ddd',
      color: isDark ? '#fff' : '#000',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.text, dynamicStyles.text]}>Hello</Text>
    </View>
  );
}

// Static styles without color values
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});
```

**Color Guidelines:**

- **Backgrounds:**
  - Light mode: `#fff` (white), `#f8f8f8` (light gray cards)
  - Dark mode: `#000` (black), `#1a1a1a` (dark gray cards)
- **Text:**
  - Light mode: `#333` (dark gray), `#666` (medium gray)
  - Dark mode: `#fff` (white), `#ccc` (light gray), `#999` (medium gray)
- **Borders:**
  - Light mode: `#eee`, `#ddd`
  - Dark mode: `#333`, `rgba(255,255,255,0.1)`
- **Inputs:**
  - Light mode: white background, light borders
  - Dark mode: `#1a1a1a` background, `#333` borders

**Testing:**

- Test EVERY new screen in both light and dark modes
- Use iOS device Settings > Display & Brightness to toggle
- Verify all text is readable with sufficient contrast
- Check that cards and inputs have appropriate backgrounds

**DO NOT hardcode colors. Always use the dynamic styles pattern above.**

### Sentry Error Tracking - MANDATORY

**CRITICAL:** All new code MUST use Sentry for error tracking.

**Sentry is already initialized in `app/_layout.tsx` via `lib/sentry.ts`.**

**Required pattern for catch blocks:**

```typescript
import { Sentry } from '@/lib/sentry';

try {
  // API call or risky operation
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  // ...
} catch (error) {
  Sentry.captureException(error, {
    extra: { operation: 'operation-name', id: someId },
  });
  Alert.alert('Error', 'Something went wrong');
}
```

**User context - set after authentication:**

```typescript
import { Sentry } from '@/lib/sentry';

// After successful sign-in:
Sentry.setUser({ id: user.id, email: user.email });

// On sign-out:
Sentry.setUser(null);
```

**Key points:**

- Error boundary is exported from `@sentry/react-native` in `_layout.tsx`
- Use `captureException()` in catch blocks with relevant context
- Include operation name and IDs for debugging
- Tests mock Sentry - no real errors sent during tests

**Environment variable:**

- `EXPO_PUBLIC_SENTRY_DSN` - Sentry DSN (set in `.env`)

### Supabase Integration

- Never commit actual credentials to git
- Use environment variables for all config
- Handle authentication state properly
- Implement proper error handling for API calls

### Authentication Architecture

The app uses Supabase Auth with a React Context-based state management system:

**Key Files:**

- `lib/supabase.ts` - Supabase client configured with AsyncStorage for
  persistence
- `contexts/AuthContext.tsx` - Auth state management (session, user, loading)
- `app/(auth)/sign-in.tsx` - Sign in screen (email/password + Google OAuth)
- `app/(auth)/sign-up.tsx` - Sign up screen (email/password + Google OAuth)
- `app/_layout.tsx` - Root layout with AuthProvider and protected route logic

**How It Works:**

1. **AuthProvider** wraps the entire app and manages auth state
1. **useProtectedRoute** hook redirects users based on auth status:
   - Not authenticated → redirect to sign-in
   - Authenticated → redirect to main app
1. **AsyncStorage** persists sessions across app restarts
1. **Form validation** checks email format and password requirements
1. **Google OAuth** opens system browser for authentication

**Auth Flow:**

```text
App Start
  ↓
AuthProvider loads session from AsyncStorage
  ↓
useProtectedRoute checks user state
  ↓
┌─ Not authenticated → /(auth)/sign-in
└─ Authenticated → /(tabs)
```

## References

- @README.md - Repository overview
- Expo Documentation: <https://docs.expo.dev/>
- React Native Documentation: <https://reactnative.dev/>
- Supabase Documentation: <https://supabase.com/docs>

---

**Last Updated:** 2025-12-19

This file should be updated whenever:

- Project patterns change
- Important context is discovered
- Tooling is added or modified
