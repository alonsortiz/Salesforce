// imports
import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

// import getSimilarBoats
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
    boatId;
    error;

    // public
    @api
    get recordId() {
        // returns the boatId
        return this.boatId;
    }
    set recordId(value) {
        // sets the boatId value
        this.boatId = value;
        // sets the boatId attribute
        this.setAttribute('boatId', value);
    }

    // public
    @api similarBy;

    // Wire custom Apex call, using the import named getSimilarBoats
    @wire(getSimilarBoats, { boatId: '$boatId', similarBy: '$similarBy' })
    // Populates the relatedBoats list
    similarBoats({ error, data }) { 
        if (data) {
            this.error = undefined;
            this.relatedBoats = data;
        } else if (error) {
            this.relatedBoats = undefined;
            this.error = error;
        }
    }

    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to record page
    openBoatDetailPage(event) { 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                actionName: 'view'
            }
        });
    }
}