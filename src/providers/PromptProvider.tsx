

interface BaseResponseFormat {
    score: string;
    requestType: string;
    description: string;

}

interface PromptStructure {
    parameters: any,
    message: string;
    baseResponseFormat: BaseResponseFormat;
    typedResponse:any;
}

class PromptProvider {
    private baseResponseFormat: BaseResponseFormat;
    private typedResponse: any;

     constructor() {
        this.baseResponseFormat = {
            score: "",
            requestType: "createPet | updatePet | createEvent",
            description: "",
        };

        this.typedResponse = [
             {
                id: "",
                title: "",
                petId: "",
                type: "",
                startDate: "",
                endDate: "",
                isRecurring: false,
                isFullDay: false,
                recurrence: {
                    frequencyType: "daily",
                    hasEndRecurrence: false,
                    endRecurrenceDate: "",
                    frequency: 1,
                    days: []
                },
                notes: ''
            },
           {
                birthDate: "",//YYYY-MM-DD
                breed: "",
                createdAt: "", // YYYY-MM-DD hh:ii (now)
                id: "",
                is_active: true,
                name: "",
                order: 0,
                ownerId: "",
                species: "dog" // dog|cat
            }
        ];
    }


    generatePrompt(message: string,parameters:any): string {

        const prompt: PromptStructure = {
            parameters: parameters,
            message: message,
            baseResponseFormat: this.baseResponseFormat,
            typedResponse: this.typedResponse
        };

        const superPrompt =
            '\n#########################################################################################\n' +
                'consignes : ' +
            "À l'aide du message ci-joint, et en te basant sur les paramètres, passer passer dans paramètres. " +
            "Peux-tu me générer une réponse au format Jason ayant la structure suivante :" +
        "   baseformatResponses concatenee a un  typedResponse que tu déterminera suivant le message." +
            "score contiendra un % de certitude que tu peux déterminer suivant le message et les infos qui te sont passées" +
            "decriptions contiendra un court résumé de ce que tu as compris." +
                "le format de la response sera :  " +
                "{\n" +
                "score:\"\",\n" +
                "requestType: \"\", (createPet,updatePet,createEvent,updateEvent)\n " +
                "description: \"\",\n" +
                "response: {}\n" +
                "}" +
            " les dates doivent avoir ce format : YYYY-MM-DD et les datetimes : YYYY-MM-DD hh:ii" +
                "si le nom de l'animal est défini, il devra toujours apparaitre dasn title si il y a une clef title" +
            "respecte le plus possible 'parameters.language' pour la langue de la réponse." +
            "!!!!! La réponse sera un json brut sans style ou decoration markedown!!!!! "    ;
        return JSON.stringify(prompt, null, 2) +  superPrompt;
    }

}




export default PromptProvider;
