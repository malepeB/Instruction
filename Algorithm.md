STEP BY STEP PLAN

So for each account, I need to keep track of a few things. First there's the
is - the person's name, their account number, and their balance.
The user has to deposit funds into the account when they create it.

Then there's two lists I need to keep for each account that aren't as obvious
at first. The first is a list of past transaction amounts - basically every
time someone withdraws or transfers, I log how much it was for. I need this
because later on I have to work out their "normal" average spend, and I
can't do that without a history to look back at. The second list is
withdrawal timestamps - every time a withdrawal happens, I note down exactly
when. This is purely for the "too fast" rule, so I can look back and count
how many withdrawals happened recently.

Deposits are the easy part. If someone's putting money in, there's nothing
to check - money coming into an account isn't the risky direction, so it
just gets added straight to the balance and that's it, no fraud logic
involved.

Withdrawals and transfers are where it gets more involved, because before
I let either of those go through, they have to pass three separate checks:

1. First, I check if the amount they're trying to take out is more than
   what's actually in the account. If it is, I block it straight away - no
   point checking anything else if they don't even have the money.
2. Next, I look at the withdrawal timestamps I mentioned earlier and count
   how many happened in the last 10 seconds. If allowing this one would
   push the count past 3, I block it too, because that pattern looks like
   a bot or someone trying to drain the account fast.
3. Last, I calculate the average of all their past transactions and compare
   it to this new amount. If it's more than 5 times bigger than what they'd
   normally move, that's flagged as a spike and blocked, since it's way
   outside their normal behaviour.

Only if it gets past all three of those do I actually let it through -
subtract the amount from the balance, log the timestamp, and add it to
their transaction history so it feeds into future average calculations.
