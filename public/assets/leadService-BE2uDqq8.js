var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { o as objectType, c as collection, d as db, s as serverTimestamp, a as addDoc, Z as ZodError, b as stringType, e as arrayType, l as literalType } from "./index-CkUjiyQb.js";
const leadSubmissionSchema = objectType({
  firstName: stringType().min(1, { message: "First name is required" }),
  lastName: stringType().min(1, { message: "Last name is required" }),
  email: stringType().email({ message: "Invalid email address" }),
  phone: stringType().optional(),
  eventType: stringType().optional(),
  eventDate: stringType().optional(),
  // Could be further validated with z.date() or a regex
  eventLocation: stringType().optional(),
  guestCount: stringType().optional(),
  // Could be z.number() if parsed
  preferredStyle: arrayType(stringType()).optional(),
  mustHaveShots: stringType().optional(),
  inspirationLinks: stringType().url({ message: "Invalid URL for inspiration links" }).optional().or(literalType("")),
  // Allow empty string or valid URL
  budget: stringType().optional(),
  hearAboutUs: stringType().optional(),
  additionalInfo: stringType().optional(),
  source: stringType().optional()
});
const createLead = (leadData) => __async(null, null, function* () {
  try {
    const validatedData = leadSubmissionSchema.parse(leadData);
    const leadsRef = collection(db, "leads");
    const lead = __spreadProps(__spreadValues({}, validatedData), {
      // Use validated data
      status: "new",
      source: validatedData.source || "website_form",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    const docRef = yield addDoc(leadsRef, lead);
    console.log("Lead created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Lead data validation error:", error.errors);
    }
    console.error("Error creating lead:", error);
    throw error;
  }
});
const submitContactForm = (formData) => __async(null, null, function* () {
  try {
    const leadId = yield createLead(formData);
    return leadId;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
});
export {
  createLead,
  submitContactForm
};
//# sourceMappingURL=leadService-BE2uDqq8.js.map
