import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector:'app-alert-modal',
    templateUrl:'./alert-modal.component.html',
    styleUrls:['./alert-modal.component.css']
})
export class AlertModalComponent {
    @Input() message:string;
    @Output() close = new EventEmitter<boolean>();


    onClose() {
        this.close.emit(false)
    }
}