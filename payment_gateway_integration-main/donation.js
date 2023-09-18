const heading = document.querySelector(".first-heading");
const description = document.querySelector(".first-subtext");
const payButton = document.querySelector("#donate");
const container = document.querySelector(".first");
const timeline = new TimelineMax({ delay: 0.2 });

window.onload = () => {
    if (window.innerWidth < 600) {
        timeline.fromTo(container, 0.5, { width: "0%", opacity: 0 }, { width: "80%", opacity: 1 });
    } else {
        timeline.fromTo(container, 0.5, { width: "0%", opacity: 0 }, { width: "50%", opacity: 1 });
    }
    timeline.fromTo(heading, 0.5, { y: -50, opacity: 0 }, { y: 0, opacity: 1 });
    timeline.fromTo(description, 0.5, { opacity: 0 }, { opacity: 1 });
    timeline.fromTo(payButton, 0.5, { opacity: 0 }, { opacity: 1 });
}

paypal.Buttons({
    style: {
        color: 'gold',
        shape: 'rect',
        label: 'donate',
        layout: 'horizontal',
        height: 40,
    },
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '10.00'
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Thank you for your donation, ' + details.payer.name.given_name + '!');
        });
    }
}).render('#paypal-payment-button');
