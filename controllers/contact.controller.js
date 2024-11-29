const Contact = require("../models/contact.model");

class ContactController {
  getAllContacts = async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  getContactById = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  createContact = async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const contact = new Contact({ name, email, subject, message });
      await contact.save();
      res.status(201).json(contact);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  updateContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };

  deleteContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, {
        status: "archived",
      });
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({ message: "Contact archived successfully" });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new ContactController();
