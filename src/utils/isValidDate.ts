const isValidDate = (dateString: string) => {
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  return datePattern.test(dateString);
};

export default isValidDate;
