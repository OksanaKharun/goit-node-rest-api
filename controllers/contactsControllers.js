
import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch (error) {
        next(error)
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) {
            throw HttpError(404);
        }
        res.json(contact);
    } catch (error) {
        next(error)

    }
   res.status(200).json(result);
  
}
 


export const deleteContact = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            throw HttpError(404);
        }
        res.json({
            message:'Delete success',
        })
    } catch (error) {
        next(error)
    }
};

export const createContact = async (req, res) => {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const result = await Contact(req.body);
    res.status(201).json(result);
};


export const updateContact = async (req, res) => {
    const { id } = req.params;

    const emptyBody = Object.keys(req.body).length === 0;
    if (emptyBody) {
        throw HttpError(400, "Body must have at least one field");
    }

   const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const contact = await Contact.findByIdAndUpdate(id, req.body);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(result); 
};
 
export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const contact = await Contact.findByIdAndUpdate(id, { new:true });
    if (!contact) {
      throw HttpError(404, "Not found");
    }

    contact.favorite = favorite;
    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};


   