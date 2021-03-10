document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#show-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  document.querySelector('#compose-form').onsubmit = function () {
    const recip = document.querySelector('#compose-recipients').value;
    const subj = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // fetch('/emails', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     recipients: recip,
    //     subject: subj,
    //     body: body
    //   })
    // })
    //   .then(response => response.json())
    //   .then(result => {
    //     console.log(result);
    //   });
    alert('Submited');
    load_mailbox('sent');
  }
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#show-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  switch (mailbox) {
    case "sent":
      fetch('/emails/sent')
        .then(response => response.json())
        .then(sent => {
          if (sent.length > 0) {
            sent.forEach(sentMail => {
              const sentElement = document.createElement('div');
              sentElement.className = 'sent-email';
              sentElement.innerHTML = `<p><strong>To: </strong>${sentMail.recipients} <strong>Subject: </strong>${sentMail.subject} <strong>Date Sent: </strong> ${sentMail.timestamp}</p>`;
              document.querySelector('#emails-view').append(sentElement);
            });
          } else {
            sentElement.innerHTML = `<p>There are no sent emails</p>`;
            document.querySelector('#emails-view').append(sentElement);
          }

        });
      break;

    case "archive":
      fetch('/emails/archive')
        .then(response => response.json())
        .then(archive => {
          if (archive.length > 0) {
            archive.forEach(archivedMail => {
              document.querySelector('#emails-view').innerHTML += `<div>${archivedMail}</div>`;
            })
          } else {
            document.querySelector('#emails-view').innerHTML += `<div>There are no emails in archived folder yet!</div>`;
          }
        });
      break;

    default:
      fetch('/emails/inbox')
        .then(response => response.json())
        .then(emails => {
          if (emails.length > 0) {
            emails.forEach(mail => {
              if (mail.archived == false) {
                const element = document.createElement('div');
                element.className = 'email';
                if (mail.read == false) {
                  element.innerHTML = `<strong>${mail.sender}${mail.subject}${mail.timestamp}</strong>`;
                  element.addEventListener('click', function () {
                    viewEmail(mail.id);
                  });
                } else {
                  element.innerHTML = `<strong>${mail.sender}</strong>${mail.subject} ${mail.timestamp}`;
                  element.addEventListener('click', function () {
                    viewEmail(mail.id);
                  });
                }
                document.querySelector('#emails-view').append(element);
              }
            });
          } else {
            document.querySelector('#emails-view').innerHTML += `<div class="email">You don't have any emails yet</div>`;
          }
        }).catch(error => {
          console.log('Error : ', error);
        });
  }
}

function viewEmail(emailId) {
  document.querySelector('#show-email').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#show-email').innerHTML = '';

  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      if (email.read == false) {
        fetch(`/emails/${emailId}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }
      const element = document.createElement('div');
      element.className = 'read-email';
      element.innerHTML = `<strong>From: </strong>${email.sender}<br>
    <strong>To: </strong>${email.recipients}<br>
    <strong>Subject: </strong>${email.subject}<br>
    <strong>Timestamp: </strong>${email.timestamp}`;
      document.querySelector('#show-email').append(element);
      document.querySelector('#show-email').innerHTML += '<button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>';
    });
}