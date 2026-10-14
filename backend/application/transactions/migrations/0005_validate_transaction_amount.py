from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("transactions", "0004_alter_expense_created_at_alter_expense_updated_at_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="expense",
            name="amount",
            field=models.DecimalField(
                decimal_places=2,
                max_digits=12,
                validators=[MinValueValidator(Decimal("0.01"))],
            ),
        ),
        migrations.AlterField(
            model_name="income",
            name="amount",
            field=models.DecimalField(
                decimal_places=2,
                max_digits=12,
                validators=[MinValueValidator(Decimal("0.01"))],
            ),
        ),
    ]
