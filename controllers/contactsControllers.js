
import {listContacts,
  getContactById,
  addContact,
  removeContact,
    updateOneContact
} from "../services/contactsServices.js";
  import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";


 export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
        throw HttpError(404, `Contact with ${id} not found`);
    }
   res.status(200).json(result);
  
}

 export const deleteContact = async(req, res) => {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
   res.status(200).json(result);
};


 export const createContact = async (req, res) => {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
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

    const result = await updateOneContact(id, req.body);
    if (!result) {
      throw HttpError(404);
    }
    res.status(200).json(result); 
 };

