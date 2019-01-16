import constants
from twilio.rest import Client

# Your Account Sid and Auth Token from twilio.com/console
account_sid = constants.TWILIO_ACCOUNT_SID
auth_token = constants.TWILIO_AUTH_TOKEN


client = Client(account_sid, auth_token)
message = client.messages.create(body='This is a test message!',
from_=constants.TWILIO_PHONE_NUMBER,
to=constants.TWILIO_PHONE_NUMBER,
)

print(message.sid)
