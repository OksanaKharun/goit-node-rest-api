
import contactsService from "../services/contactsServices.js";
const schema = require("../schemas/contactsSchemas.js");
const { HttpError } = require("../helpers/HttpError.js");


export const getAllContacts = async (req, res) => {
   
    const result = await contactsService.listContacts();
    res.status(200).json(result);
};


export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404, `Contact with ${id} not found`);
    }
   res.status(200).json(result);
  
}
 

export const deleteContact = async(req, res) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
   res.status(200).json(result);
};


export const createContact = async (req, res) => {
    const { error } = schema.createContactSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
};


export const updateContact = async (req, res) => {
    const { id } = req.params;

    const emptyBody = Object.keys(req.body).length === 0;
    if (emptyBody) {
        throw HttpError(400, "Body must have at least one field");
    }

   const { error } = schema.updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result); 
 };
