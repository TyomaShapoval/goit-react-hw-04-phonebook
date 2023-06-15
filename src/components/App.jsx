import { useState, useEffect } from 'react';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import { WrapperContent } from './App.styled';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contactsLS = JSON.parse(localStorage.getItem('contacts'));
    if (contactsLS) {
      setContacts(contactsLS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const createContact = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    if (contacts.find(existingContact => existingContact.name === contact.name)) {
      Notiflix.Notify.failure(`Contact ${contact.name} already exists`);
    } else {
      setContacts(prevContacts => [contact, ...prevContacts]);
      Notiflix.Notify.success(`Contact ${contact.name} added to your phonebook`);
    }
  };

  const deleteContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== contactId)
    );
  };

  const getFilteredContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  return (
    <WrapperContent>
      <ContactForm createContact={createContact} />
      <Filter value={filter} onChange={handleFilterChange} />
      <ContactList
        deleteContact={deleteContact}
        contacts={getFilteredContacts()}
      />
    </WrapperContent>
  );
};
