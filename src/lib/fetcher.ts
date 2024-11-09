class FetchError extends Error {
  info: any;
  status: number;

  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

const fetcher = async (url: string): Promise<any> => {
  const res: Response = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new FetchError(
      "An error occurred while fetching the data.",
      await res.json(),
      res.status
    );
    throw error;
  }

  return res.json();
};

export default fetcher;
