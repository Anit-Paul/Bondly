from .models import User
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
            'about': {'required': False},
            'gender': {'required': False},
            'dob': {'required': False},
            'image': {'required': False},
            'banner': {'required': False},
            'interest': {'required': False},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        interests = validated_data.pop('interest', [])

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if interests:
            user.interest.set(interests)

        return user
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        interests = validated_data.pop('interest', None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle password
        if password:
            instance.set_password(password)

        # Handle interests
        if interests is not None:
            instance.interest.set(interests)

        instance.save()
        return instance
