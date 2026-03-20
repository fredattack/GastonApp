import axiosClient from "../providers/apiClientProvider/axiosClient";

class FeedingService {
    private basePath = "/feeding";

    async getTodayFeedings(date?: string): Promise<FeedingTodayResponse> {
        const params = date ? { date } : {};
        const response = await axiosClient.get(`${this.basePath}/today`, { params });
        return response.data;
    }

    async markDone(scheduleId: number, fedBy?: string): Promise<void> {
        await axiosClient.post(`${this.basePath}/mark-done`, {
            schedule_id: scheduleId,
            fed_by: fedBy,
        });
    }

    async markBatch(scheduleIds: number[], fedBy?: string): Promise<{ marked: number }> {
        const response = await axiosClient.post(`${this.basePath}/mark-batch`, {
            schedule_ids: scheduleIds,
            fed_by: fedBy,
        });
        return response.data;
    }

    async markBatchBySpecies(species: string, mealSlot?: string, fedBy?: string): Promise<{ marked: number }> {
        const response = await axiosClient.post(`${this.basePath}/mark-batch`, {
            species,
            meal_slot: mealSlot,
            fed_by: fedBy,
        });
        return response.data;
    }

    async undoMark(scheduleId: number): Promise<void> {
        await axiosClient.post(`${this.basePath}/undo-mark`, {
            schedule_id: scheduleId,
        });
    }

    async getSchedules(): Promise<any[]> {
        const response = await axiosClient.get(`${this.basePath}/schedules`);
        return response.data;
    }

    async createSchedule(data: Partial<FeedingSchedule>): Promise<FeedingSchedule> {
        const response = await axiosClient.post(`${this.basePath}/schedules`, data);
        return response.data;
    }

    async updateSchedule(id: number, data: Partial<FeedingSchedule>): Promise<FeedingSchedule> {
        const response = await axiosClient.put(`${this.basePath}/schedules/${id}`, data);
        return response.data;
    }

    async getHistory(petId: number, days?: number): Promise<any[]> {
        const params = days ? { days } : {};
        const response = await axiosClient.get(`${this.basePath}/history/${petId}`, { params });
        return response.data;
    }

    async sendVoiceCommand(transcript: string): Promise<VoiceCommandResult> {
        const response = await axiosClient.post("/ai/command", { transcript });
        return response.data;
    }
}

export const feedingService = new FeedingService();
