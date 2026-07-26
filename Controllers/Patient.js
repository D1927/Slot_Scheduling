const Patient = require("./../Models/Patient")
const handler_factory = require("./handler_factory")

// Enroll Patients 
exports.enroll_patient = handler_factory.create_document(Patient)

// Get specific Patient using ID (for Patient and admin)
exports.get_patient_using_id = handler_factory.get_document_by_id(Patient)

// To delete Patient using ID (for Patient and admin)
exports.delete_patient_using_id = handler_factory.delete_document_by_id(Patient)

// Get all Patients (for admin only)
exports.get_patient = handler_factory.get_all_document(Patient)