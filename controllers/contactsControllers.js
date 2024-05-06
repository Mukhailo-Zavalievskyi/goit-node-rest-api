import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const oneContact = await contactsService.getContactById(id);
  if (oneContact) {
    res.status(200).json(oneContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deleteContact = await contactsService.removeContact(id);
  if (deleteContact) {
    res.status(200).json(deleteContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const addContact = await contactsService.addContact(name, email, phone);
  res.status(201).json(addContact);
};

export const updateContact = async (req, res) => {
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
  const updateContact = await contactsService.updateContact(id, req.body);
  if (updateContact) {
    res.status(200).json(updateContact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};
