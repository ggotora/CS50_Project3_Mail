document.addEventListener('DOMContentLoaded', function() {

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
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-form').addEventListener('submit', postEmails)

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox'){
    fetchEmails(`emails/${mailbox}`, mailbox)
  }

  if (mailbox === 'sent'){
    fetchEmails(`emails/${mailbox}`, mailbox)
  }

  if (mailbox === 'archived'){
    fetchEmails(`emails/${mailbox}`, mailbox)
  }
  
}

function postEmails(e){
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;
  e.preventDefault()
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  });
}

function fetchEmails(mail, mailbox){
  fetch(mail)
.then(response => response.json())
.then(emails => {
    // Print emails
    emails.forEach(email => {
      const fetchEmailDiv = document.createElement('div')
      fetchEmailDiv.innerHTML =
        `
        <div class="container">
          <a href="#" class="row shadow-sm p-2 my-4 bg-white rounded m-0">
            <div class="col-sm">
              ${mailbox == 'sent' ? email.recipients : email.sender}
            </div>
            <div class="col-sm">
              ${email.subject}
            </div>
            <div class="col-sm">
              ${email.timestamp}
            </div>
          </a>
        </div>
        `
        document.querySelector('#emails-view').append(fetchEmailDiv)
      
    });

    });
}