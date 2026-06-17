import React from 'react';
import "./RightBar.css";
import Avatar from '@mui/material/Avatar';

const RightBar = () => {
  const contacts = [
    // sample contacts...
    { name: "Alice" }, { name: "Bob" }, { name: "Charlie" }, { name: "David" },
    { name: "Emma" }, { name: "Frank" }, { name: "Grace" }, { name: "Henry" },
    { name: "Isabel" }, { name: "John" }, { name: "Kelly" }, { name: "Liam" }
  ];

  return (
    <aside className="RightBar">
      <h4>Sponsored</h4>
      <div className="sponsor-box">Sponsored Content 1</div>
      <div className="sponsor-box">Sponsored Content 2</div>

      <h4 className="contacts-title">Contacts</h4>
      {contacts.map((contact, idx) => (
        <div className="contact-item" key={idx}>
          <Avatar
            alt={contact.name}
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`}
            sx={{ width: 32, height: 32 }}
          />
          <span>{contact.name}</span>
        </div>
      ))}
    </aside>
  );
}

export default RightBar;

