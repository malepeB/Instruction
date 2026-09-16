BANK SYSTEM INSTRUCTION

A person creates their account, using account holder name
a. The user gets a randomly generated account number of five numbers 
b. The user has to deposit funds into the account when creating an account
Store the created accounts somewhere for them to be accessed later
The user can make withdrawals from their account
a. If a user makes a withdrawal request within 10 seconds of making a withdrawal, check if they've made more than 3 withdrawals in that 10 second window b. Check if the user has enough funds for the withdrawal, and if they do, proceed, otherwise block the withdrawal c. Check the amount against the user's average transaction size, if the new amount is more than 5 times bigger than that average, block the withdrawal and flag it
The user can also make transfers to other accounts, using the recipient's account number a. Check that the sender has enough funds to cover the transfer, and if they do, proceed, otherwise block the transfer b. Check if the sender has made more than 3 withdrawals in the last 10 seconds, and if so, block the transfer c. Check the transfer amount against the sender's average transaction size, if it's more than 5 times bigger, block the transfer and flag it d. If all checks pass, decrease the sender's balance and increase the receiver's balance by the transfer amount
Every successful withdrawal or transfer gets logged, the amount is added to that account's transaction history and the current time is added to that account's withdrawal timestamps, this is what steps 3 and 4 use to check the 10 second rule and the average
Deposits always succeed, no checks are needed, the amount just gets added to the balance
