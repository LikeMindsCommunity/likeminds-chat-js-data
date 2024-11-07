interface LMResponseType<T> {
  success: boolean;
  errorMessage: string | null;
  data: T;
}

export default LMResponseType;
