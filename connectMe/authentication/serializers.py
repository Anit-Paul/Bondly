from .models import User, Interest
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    dob = serializers.DateField(
        input_formats=["%d-%m-%Y", "%Y-%m-%d"],  # Accept formats like "15-09-2001" or "2001-09-15"
        format="%d-%m-%Y",  # Output format
        required=False,
        allow_null=True,
    )
    interest = serializers.ListField(child=serializers.CharField(), write_only=True,required=False,allow_empty=True)
    interests = serializers.SerializerMethodField(read_only=True)  # to return names in response

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        interests_data = validated_data.pop('interest', [])
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        # Convert interest strings to objects
        for name in interests_data:
            interest_obj, _ = Interest.objects.get_or_create(name=name)
            user.interest.add(interest_obj)

        return user

    def update(self, instance, validated_data):
        interests_data = validated_data.pop('interest', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if interests_data is not None:
            new_interests = []
            for name in interests_data:
                interest_obj, _ = Interest.objects.get_or_create(name=name)
                new_interests.append(interest_obj)
            instance.interest.set(new_interests)

        instance.save()
        return instance

    def get_interests(self, obj):
        return [i.name for i in obj.interest.all()]
