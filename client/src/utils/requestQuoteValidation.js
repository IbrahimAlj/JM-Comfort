export const quoteInitialValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  preferred_date: "",
  preferred_time_slot: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{3,}$/;
const zipRegex = /\b\d{5}(?:-\d{4})?\b/;

function getPhoneDigits(value) {
  return value.replace(/\D/g, "");
}

export function validateQuote(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (getPhoneDigits(values.phone).length < 10) {
    errors.phone = "Phone number must contain at least 10 digits.";
  }

  if (!values.address.trim()) {
    errors.address = "Address is required.";
  } else if (!zipRegex.test(values.address.trim())) {
    errors.address = "Address must include a valid ZIP code.";
  }

  return errors;
}

export function validateQuoteField(name, value) {
  const trimmed = value.trim();

  // Could argue that a valid API could be used to verify certain numbers, emails, and zip codes in america here. 
  switch (name) {
    case "name":
    if (!trimmed) return "";

    if (!/^[A-Za-z\s'-]+$/.test(trimmed)) {
        return "Name must contain only letters.";
    }

    if (trimmed.length < 2) {
        return "Name must be at least 2 characters.";
    }

return "";

    case "email":
      if (!trimmed) return "";
      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address.";
      }
      return "";

    case "phone":
      if (!trimmed) return "";
      if (getPhoneDigits(value).length < 10) {
        return "Phone number must contain at least 10 digits.";
      }
      return "";

    case "address":
      if (!trimmed) return "";
      if (!zipRegex.test(trimmed)) {
        return "Address must include a valid ZIP code.";
      }
      return "";

    default:
      return "";
  }
}