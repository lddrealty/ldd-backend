const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contact.controller");
const { Auth } = require("../middlewares/auth.middleware");

router.get("/", [Auth], ContactController.getAllContacts);
router.get("/:id", [Auth], ContactController.getContactById);
router.post("/", ContactController.createContact);
router.put("/:id", [Auth], ContactController.updateContact);
router.delete("/:id", [Auth], ContactController.deleteContact);

module.exports.ContactRouter = router;
