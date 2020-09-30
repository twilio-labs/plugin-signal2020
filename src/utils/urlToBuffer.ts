import got from 'got';

export async function urlToBuffer(url: string): Promise<Buffer | null> {
  if (!url) {
    return null;
  }

  const resp = got(url);
  if (resp) {
    return resp.buffer();
  }
  return null;
}
