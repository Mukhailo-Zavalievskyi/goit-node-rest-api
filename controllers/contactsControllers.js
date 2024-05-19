import Contact from "../models/contacts.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneContact = await Contact.findById(id);
    if (oneContact === null) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(oneContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteContact = await Contact.findByIdAndDelete(id);
    if (deleteContact === null) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(deleteContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const addContact = await Contact.create({ name, email, phone });
    res.status(201).json(addContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
  const { error } = updateContactSchema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const updateContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateContact === null) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    const updateStatusContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      }
    );
    if (updateStatusContact === null) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updateStatusContact);
  } catch (error) {
    next(error);
  }
};
