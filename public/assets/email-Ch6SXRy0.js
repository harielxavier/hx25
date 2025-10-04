const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-YqpwOcP5.js","./index-DmIXZw0B.css","./leadService-DYOWkoDo.js"])))=>i.map(i=>d[i]);
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
import { i as __vitePreload, F as FunctionsError, j as connectFunctionsEmulator, k as getFunctions, m as httpsCallable } from "./index-YqpwOcP5.js";
const index_esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FunctionsError,
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable
}, Symbol.toStringTag, { value: "Module" }));
const sendEmail = (options) => __async(null, null, function* () {
  try {
    const { functions } = yield __vitePreload(() => __async(null, null, function* () {
      const { functions: functions2 } = yield import("./index-YqpwOcP5.js").then((n) => n.n);
      return { functions: functions2 };
    }), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url);
    const { httpsCallable: httpsCallable2 } = yield __vitePreload(() => __async(null, null, function* () {
      const { httpsCallable: httpsCallable3 } = yield Promise.resolve().then(() => index_esm);
      return { httpsCallable: httpsCallable3 };
    }), true ? void 0 : void 0, import.meta.url);
    const sendEmailFn = httpsCallable2(functions, "sendEmail");
    const payload = {
      to: options.to,
      subject: options.subject,
      html: options.html,
      from: options.from,
      // Pass optional fields if they exist
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    };
    yield sendEmailFn(payload);
    console.log("Email request sent via generic sendEmail function:", payload);
    return true;
    return false;
  } catch (error) {
    console.error("Error in sendEmail stub (frontend):", error);
    return false;
  }
});
const registerLead = (leadData) => __async(null, null, function* () {
  try {
    console.log("Registering lead in CRM:", leadData);
    const crmData = {
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || "",
      eventType: leadData.eventType || "",
      eventDate: leadData.eventDate || "",
      eventLocation: leadData.eventLocation || "",
      guestCount: leadData.guestCount || "",
      preferredStyle: leadData.preferredStyle || [],
      mustHaveShots: leadData.mustHaveShots || "",
      inspirationLinks: leadData.inspirationLinks || "",
      budget: leadData.budget || "",
      hearAboutUs: leadData.hearAboutUs || "",
      additionalInfo: leadData.message || leadData.additionalInfo || "",
      source: leadData.source || "Website Contact Form"
    };
    try {
      const { submitContactForm } = yield __vitePreload(() => __async(null, null, function* () {
        const { submitContactForm: submitContactForm2 } = yield import("./leadService-DYOWkoDo.js");
        return { submitContactForm: submitContactForm2 };
      }), true ? __vite__mapDeps([2,0,1]) : void 0, import.meta.url);
      const leadId = yield submitContactForm(crmData);
      console.log("Lead created in Firestore with ID:", leadId);
    } catch (error) {
      console.error("Error creating lead in Firestore:", error);
    }
    return true;
  } catch (error) {
    console.error("Failed to register lead in CRM:", error);
    return false;
  }
});
const verifyEmailConnection = () => __async(null, null, function* () {
  try {
    console.error("SMTP connection verification cannot be performed from the frontend.");
    return false;
  } catch (error) {
    console.error("Error in verifyEmailConnection stub (frontend):", error);
    return false;
  }
});
const email = {
  sendEmail,
  registerLead,
  verifyEmailConnection
};
export {
  email as default,
  registerLead,
  sendEmail,
  verifyEmailConnection
};
//# sourceMappingURL=email-Ch6SXRy0.js.map
