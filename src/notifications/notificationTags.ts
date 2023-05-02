import OneSignal from "react-native-onesignal";
import { useAuth } from '@hooks/useAuth'

export function tagUserInfoCreate() {
    const { user } = useAuth();

    OneSignal.sendTags({
        'user_name': user.name,
        'user_email:': user.email,
    })
}

export function exercisesCountByDay(count: string) {
    OneSignal.sendTag("exercises_count_by_day", count)
}