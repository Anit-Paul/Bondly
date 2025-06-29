import json
from rest_framework import serializers
from .models import User, Interest

class UserSerializer(serializers.ModelSerializer):
    dob = serializers.DateField(
        input_formats=["%d-%m-%Y", "%Y-%m-%d"],
        format="%d-%m-%Y",
        required=False,
        allow_null=True,
    )
    interest = serializers.CharField(write_only=True, required=False)
    interests = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Pop interest field if exists (comes as JSON string)
        interest_raw = validated_data.pop("interest", "[]")
        try:
            interest_list = json.loads(interest_raw)
        except (json.JSONDecodeError, TypeError):
            interest_list = []

        # Pop M2M fields if accidentally included (important!)
        validated_data.pop("groups", None)
        validated_data.pop("user_permissions", None)

        # Pop password and set it securely
        password = validated_data.pop("password", None)

        # Now create user safely
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        # Now assign many-to-many interests properly
        for name in interest_list:
            obj, _ = Interest.objects.get_or_create(name=name)
            user.interest.add(obj)

        return user

    def update(self, instance, validated_data):
        interest_raw = validated_data.pop("interest", None)
        if interest_raw:
            try:
                interest_list = json.loads(interest_raw)
                interests = []
                for name in interest_list:
                    obj, _ = Interest.objects.get_or_create(name=name)
                    interests.append(obj)
                instance.interest.set(interests)
            except json.JSONDecodeError:
                pass

        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def get_interests(self, obj):
        return [i.name for i in obj.interest.all()]
