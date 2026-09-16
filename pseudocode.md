CLASS Account:
    name
    balance
    history            # list of past withdrawal/transfer amounts
    withdrawal_times   # list of timestamps

FUNCTION create_account(name, starting_balance):
    new_account = Account(name, starting_balance, [], [])
    RETURN new_account

FUNCTION deposit(account, amount):
    account.balance = account.balance + amount
    RETURN "Success"

FUNCTION has_enough_funds(account, amount):
    RETURN amount <= account.balance

FUNCTION is_too_fast(account):
    count = 0
    FOR each time in account.withdrawal_times:
        IF (now - time) <= 10 seconds:
            count = count + 1
    RETURN (count + 1) > 3

FUNCTION is_spike(account, amount):
    IF account.history is empty:
        RETURN false
    average = sum(account.history) / length(account.history)
    RETURN amount > (5 * average)

FUNCTION withdraw(account, amount):
    IF NOT has_enough_funds(account, amount):
        RETURN "Blocked: Insufficient Funds"
    IF is_too_fast(account):
        RETURN "Blocked: Too Fast"
    IF is_spike(account, amount):
        RETURN "Blocked: Unusual Spike"

    account.balance = account.balance - amount
    account.withdrawal_times.append(now)
    account.history.append(amount)
    RETURN "Success"

FUNCTION transfer(sender, receiver, amount):
    result = withdraw(sender, amount)   # runs all 3 checks
    IF result == "Success":
        receiver.balance = receiver.balance + amount
    RETURN result
