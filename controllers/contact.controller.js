const sendMail = require("../config/transporter");
const Contact = require("../models/contact.model");
const createFilter = require("../utils/createFilter");

class ContactController {
  getAllContacts = async (req, res) => {
    try {
      const { options } = createFilter(req.query);

      const data = await Contact.paginate({}, options);

      return res.status(200).json({
        message: "All Contact Fetched successful",
        data: data.docs,
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
        currentPage: data.page,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
      });
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
      console.log(req.body);
      const contact = new Contact(req.body);
      await contact.save();

      // await sendMail({
      //   context: {
      //     name: contact?.name,
      //     email: contact?.email,
      //     message: contact?.message,
      //     phone: contact?.phone,
      //   },
      // });
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
