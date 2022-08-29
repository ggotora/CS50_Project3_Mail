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
  document.querySelector('#single-email-view').style.display = 'none';

  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox'){
    fetchEmails(`emails/${mailbox}`, mailbox)
    

  }

  if (mailbox === 'sent'){
    fetchEmails(`emails/${mailbox}`, mailbox)
  }

  if (mailbox === 'archive'){
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
        <a href="#">
        <div class="container">
          <div class="row shadow-sm p-2 my-2 ${email.read ? 'bg-secondary text-light': 'bg-white'} rounded">
            <div class="col-sm">
              ${mailbox == 'sent' ? email.recipients : email.sender}
            </div>
            <div class="col-sm">
              ${email.subject}
            </div>
            <div class="col-sm">
              ${email.timestamp}
            </div>
          </div>
        </div>
        </a>
        `
        document.querySelector('#emails-view').append(fetchEmailDiv)
        fetchEmailDiv.addEventListener('click', () => {
          document.querySelector('#emails-view').style.display = 'none';
           markAsRead(email)
           readEmail(email)
        })
      
    });

    });
}

function readEmail(email){
  // Reset single-email-view markup
  document.querySelector('#single-email-view').innerHTML = '';
  const readEmailDiv = document.createElement('div')
  readEmailDiv.innerHTML =
    `
      <div><span class="font-weight-bold">From:</span> ${email.sender}</div>
      <div><span class="font-weight-bold">To:</span> ${email.recipients}</div>
      <div><span class="font-weight-bold">Subject:</span> ${email.subject}</div>
      <div><span class="font-weight-bold">Timestamp:</span> ${email.timestamp}</div>
      <button id="reply" class="btn btn-sm btn-outline-primary" >Reply</button>
      <button id="archive" class="btn btn-sm btn-outline-primary" >${email.archived ? "Remove from archived?": "Archive Email?"}</button>

    `
  document.querySelector('#single-email-view').style.display = 'block';
  
  document.querySelector('#single-email-view').append(readEmailDiv)


  
  document.querySelector('#reply').addEventListener('click', () => {
    // reset readEmail page
    document.querySelector('#single-email-view').innerHTML = '';
    showEmailForm(email)

  })
  document.querySelector('#archive').addEventListener('click', () => {
    archiveEmail(email)

  })
}

function showEmailForm(mail){
  compose_email()
  document.querySelector('#compose-recipients').value = mail.sender;
  document.querySelector('#compose-subject').value = `Re: ${mail.subject}`;
  document.querySelector('#compose-body').value = 
  `On ${mail.timestamp} ${mail.sender} wrote:
  ${mail.body}
  `;

  
}

function markAsRead(mail){
  fetch(`/emails/${mail.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

}

function archiveEmail(mail){
  console.log(mail.archived)
  if (mail.archived){
    fetch(`/emails/${mail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })

  }else {
    fetch(`/emails/${mail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived : true
      })
    })
  }
  location.reload()

}