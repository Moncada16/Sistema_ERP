// gestiona access token en sessionStorage
export function setAccessToken(token: string) {
  sessionStorage.setItem('accessToken', token);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem('accessToken');
}
