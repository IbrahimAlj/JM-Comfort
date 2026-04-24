export const quoteInitialValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  zip: "",
  availability_slot_id: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{3,}$/;
const zipRegex = /^\d{5}(?:-\d{4})?$/;

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
  }

  if (!values.zip.trim()) {
    errors.zip = "ZIP code is required.";
  } else if (!zipRegex.test(values.zip.trim())) {
    errors.zip = "Enter a valid ZIP (e.g. 95814 or 95814-1234).";
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
      return "";

    case "zip":
      if (!trimmed) return "";
      if (!zipRegex.test(trimmed)) {
        return "Enter a valid ZIP (e.g. 95814 or 95814-1234).";
      }
      return "";

    default:
      return "";
  }
}