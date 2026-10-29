/**
 * Password policy for passwords that are SET (admin user creation/update and
 * admin reset). Follows NIST 800-63B guidance: length over composition rules,
 * no required character classes, and a high maximum so passphrases are allowed.
 *
 * bcrypt only uses the first 72 bytes, so MAX is kept well above that purely
 * to bound request size.
 * TODO(security): check new passwords against a leaked-password list.
 */
export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;

export function isAcceptablePassword(password: unknown): password is string {
  return (
    typeof password === 'string' &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}
