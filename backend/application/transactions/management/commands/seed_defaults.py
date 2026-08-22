from django.core.management.base import BaseCommand

from transactions.models_files.income_source_model import IncomeSource
from transactions.models_files.expense_category_model import ExpenseCategory


class Command(BaseCommand):
    help = "Seed default income sources and expense categories"

    def handle(self, *args, **kwargs):
        # Income Sources
        income_sources = [
            {"name": "Salary", "icon": "BriefcaseBusiness"},
            {"name": "Freelancing", "icon": "Laptop"},
            {"name": "Gift", "icon": "Gift"},
            {"name": "Investments/Dividends", "icon": "LineChart"},
            {"name": "Other", "icon": "CirclePoundSterling"},
            {"name": "Bank Interest", "icon": "University"},
            {"name": "Business Revenue", "icon": "Store"},
            {"name": "Scholarship/Stipend", "icon": "GraduationCap"},
            {"name": "Rental Income", "icon": "Building"},
            {"name": "Family Support", "icon": "Users"},
        ]

        for item in income_sources:
            obj, created = IncomeSource.objects.get_or_create(name=item["name"], defaults={"icon": item["icon"]})
            if created:
                self.stdout.write(self.style.SUCCESS(f"✔️ Created income source: {item['name']}"))

        # Expense Categories
        expense_categories = [
            {"name": "Food & Drinks", "icon": "Utensils"},
            {"name": "Transport", "icon": "Car"},
            {"name": "Rent & Utilities", "icon": "HousePlug"},
            {"name": "Subscriptions", "icon": "Tv"},
            {"name": "Entertainment", "icon": "Gamepad2"},
            {"name": "Shopping", "icon": "ShoppingCart"},
            {"name": "Healthcare", "icon": "HeartPulse"},
            {"name": "Education", "icon": "School"},
            {"name": "Travel", "icon": "Plane"},
            {"name": "Donation/Zakat", "icon": "HandHeart"},
            {"name": "Repairs", "icon": "Wrench"},
            {"name": "Books & Courses", "icon": "BookOpen"},
            {"name": "Family/Kids", "icon": "Baby"},
            {"name": "Pets", "icon": "PawPrint"},
            {"name": "Personal Care", "icon": "BookHeart"},
            {"name": "Hobbies", "icon": "Camera"},
            {"name": "Miscellaneous", "icon": "Dices"},
            {"name": "Moving/Relocation", "icon": "Truck"},
            {"name": "Tools/Equipment", "icon": "ToolCase"},
            {"name": "Debt Repayment", "icon": "PiggyBank"},
        ]

        for item in expense_categories:
            obj, created = ExpenseCategory.objects.get_or_create(name=item["name"], defaults={"icon": item["icon"]})
            if created:
                self.stdout.write(self.style.SUCCESS(f"✔️ Created expense category: {item['name']}"))

        self.stdout.write(self.style.SUCCESS("✅ Done seeding all default categories!"))
