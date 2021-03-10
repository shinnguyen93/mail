from django.contrib import admin
from .models import Email, User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    pass

class EmailAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)