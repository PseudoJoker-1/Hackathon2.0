from rest_framework import serializers
from .models import *
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
import random, string
from datetime import timedelta

    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role', 'is_admin', 'facility']

class WalletSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    class Meta:
        model = Wallet
        fields = '__all__'
        read_only_fields = ['user','facility','facility_name']

class SendCodeSerializer(serializers.Serializer):


    email = serializers.EmailField()

    def create(self,validated_data):
        email = validated_data['email']
        Sendcode.objects.filter(email=email,is_used=False).update(is_used=False)
        code = ''.join(random.choices(string.digits,k=6))

        ev = Sendcode.objects.create(email=email,code=code)

        send_mail(
            "Your verification code",
            f"Code: {code}"
            " The code lasts 10 minutes",
            "armaha2302@gmail.com",
            [email]

        )
        return ev

class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code  = serializers.CharField(max_length=6)
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            ev = Sendcode.objects.get(
                email=data['email'],
                code=data['code'],
                is_used=False
            )
        except Sendcode.DoesNotExist:
            raise serializers.ValidationError("Код неверен или уже использован")

        if ev.is_expired():
            raise serializers.ValidationError("Код истёк")

        data['ev'] = ev
        return data

    def create(self, validated_data):
        # отмечаем код как использованный
        ev = validated_data.pop('ev')
        ev.is_used = True
        ev.save()

        # создаём пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        # fields = ['id', 'number']
        fields = ['id', 'facility', 'name']

class ReportSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['user','user_name']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['user_name'] = self.context['request'].user.username
        return super().create(validated_data)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'label', 'price','id']

class RedeemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redeem
        field = ['user', 'product', 'redeem_date', 'code']

class FacilityCreateSerializer(serializers.ModelSerializer):
    organization_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    is_organization = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Facility
        fields = ("id", "title", "organization_id", "is_organization", "created_at")

    def get_is_organization(self, obj):
        return obj.organization_id is not None

    def validate(self, attrs):
        org_id = attrs.pop("organization_id", None)
        user = self.context["request"].user

        if org_id:
            try:
                org = Organization.objects.get(id=org_id)
            except Organization.DoesNotExist:
                raise serializers.ValidationError({"organization_id": "Organization not found"})
            if not org.memberships.filter(user=user).exists():
                raise serializers.ValidationError({"organization_id": "You are not a member of this organization"})
            attrs["organization"] = org
            attrs["owner"] = None
        else:
            attrs["owner"] = user
            attrs["organization"] = None

        return attrs

    def create(self, validated_data):
        facility = Facility.objects.create(**validated_data)
        FacilityMembership.objects.get_or_create(
            user=self.context["request"].user,
            facility=facility,
            defaults={"role": FacilityMembership.Role.OWNER if facility.owner_id else FacilityMembership.Role.LEADER}
        )
        return facility
    
class FacilityListSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    joined_at = serializers.SerializerMethodField()
    is_organization = serializers.SerializerMethodField()
    organization = serializers.SerializerMethodField()

    class Meta:
        model = Facility
        fields = ("id", "title", "is_organization", "organization", "role", "joined_at", "created_at")

    def get_is_organization(self, obj):
        return obj.organization_id is not None

    def get_organization(self, obj):
        if obj.organization_id:
            return {"id": str(obj.organization_id), "title": obj.organization.title}
        return None

    def _membership(self, obj):
        if hasattr(obj, "my_membership") and obj.my_membership:
            return obj.my_membership[0]
        user = self.context["request"].user
        return obj.memberships.filter(user=user).only("role", "joined_at").first()

    def get_role(self, obj):
        m = self._membership(obj)
        return m.role if m else None

    def get_joined_at(self, obj):
        m = self._membership(obj)
        return m.joined_at if m else None