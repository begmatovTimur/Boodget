# transactions/signals.py
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Income, Expense
from .models import Account  # or wherever your Account model is

# Handle CREATE
@receiver(post_save, sender=Income)
def update_account_on_income_create(sender, instance, created, **kwargs):
    if created:
        account = instance.account
        account.balance += instance.amount
        account.save()

@receiver(post_save, sender=Expense)
def update_account_on_expense_create(sender, instance, created, **kwargs):
    if created:
        account = instance.account
        account.balance -= instance.amount
        account.save()

# Handle DELETE
@receiver(post_delete, sender=Income)
def revert_account_on_income_delete(sender, instance, **kwargs):
    account = instance.account
    account.balance -= instance.amount
    account.save()

@receiver(post_delete, sender=Expense)
def revert_account_on_expense_delete(sender, instance, **kwargs):
    account = instance.account
    account.balance += instance.amount
    account.save()

# Handle UPDATE
@receiver(pre_save, sender=Income)
def adjust_account_on_income_update(sender, instance, **kwargs):
    if instance.pk:
        old = Income.objects.get(pk=instance.pk)
        diff = instance.amount - old.amount
        instance.account.amount += diff
        instance.account.save()

@receiver(pre_save, sender=Expense)
def adjust_account_on_expense_update(sender, instance, **kwargs):
    if instance.pk:
        old = Expense.objects.get(pk=instance.pk)
        diff = instance.amount - old.amount
        instance.account.amount -= diff
        instance.account.save()
