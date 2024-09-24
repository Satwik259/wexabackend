import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getUserNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; 

  try {
    const notifications = await Notification.find({ user: userId }).sort({ date: -1 });

    if (!notifications || notifications.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, "No notifications found", []));
    }

    res.status(200).json(
      new ApiResponse(200, "Notifications fetched successfully", notifications)
    );
  } catch (error) {
    next(new ApiError(500, "Failed to fetch notifications"));
  }
});

const markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return next(new ApiError(404, "Notification not found"));
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "Unauthorized access"));
    }

    notification.read = true;
    await notification.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Notification marked as read", notification));
  } catch (error) {
    next(new ApiError(500, "Failed to mark notification as read"));
  }
});

export { getUserNotifications, markNotificationAsRead };


