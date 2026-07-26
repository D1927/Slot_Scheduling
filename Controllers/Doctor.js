const Doctor = require("./../Models/Doctor")
const handler_factory = require("./handler_factory")

// Enroll Doctors 
exports.enroll_doctor = handler_factory.create_document(Doctor)

// Get specific Doctor using ID (for Doctor and admin)
exports.get_doctor_using_id = handler_factory.get_document_by_id(Doctor)

// To delete Doctor using ID (for Doctor and admin)
exports.delete_doctor_using_id = handler_factory.delete_document_by_id(Doctor)

// Get all Doctors (for admin only)
exports.get_doctor = handler_factory.get_all_document(Doctor)