import { hadithAppActivation } from "../models/hadithAppActivation.model.js";

export const checkActivation = async (req, res) => {
    try {

        const { deviceId } = req.params;

        if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: "Device ID is required"
            });
        }

        let device = await hadithAppActivation.findOne({ deviceId });

        // First installation
        if (!device) {

            const today = new Date();

            const trialEnd = new Date(today);
            trialEnd.setDate(trialEnd.getDate() + 3);

            device = await hadithAppActivation.create({
                deviceId,
                firstInstall: today,
                trialStart: today,
                trialEnd,
                activated: true
            });

        } else {

            if (device.activated && new Date() > device.trialEnd) {
                device.activated = false;
                await device.save();
            }

        }

        return res.json({
            success: true,
            message: "Activation information",
            data: {
                deviceId: device.deviceId,
                mobileNo: device.mobileNo,
                firstInstall: device.firstInstall,
                trialStart: device.trialStart,
                trialEnd: device.trialEnd,
                activated: device.activated
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};