contract Counter {
    uint256 private value;

    // Increments the counter by 1 and emits a ValueChanged event
    function increment() public {
        value += 1;
    }

    // Returns the current value of the counter
    function getValue() public view returns (uint256) {
        return value;
    }
}