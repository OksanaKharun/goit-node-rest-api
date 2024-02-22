const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");


const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find(el => el.id === contactId);
    if (contact) {
    return contact;
  } else {
    return null;
  }
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const deletedContactIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (deletedContactIndex !== -1) {
    const [deletedContact] = contacts.splice(deletedContactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return deletedContact;
  } else {
    return null;
  }
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateOneContact(contactId, updatedData) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === contactId);

  if (contactIndex !== -1) {
    contacts[contactIndex] = { ...contacts[contactIndex], ...updatedData };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[contactIndex];
  } else {
    return null;
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateOneContact
};